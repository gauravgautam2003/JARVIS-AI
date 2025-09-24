import geminiResponse from "../../gemini.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import moment from "moment";


export const getcurrentUser = async (req, res) => {
    try {
        const userId = req.userId


        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        return res.status(200).json(user);

    } catch (error) {
        return res.status(400).json({ message: "get current user error" });
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage;
        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path);
        } else {
            assistantImage = await imageUrl;
        }
        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                assistantName,
                assistantImage
            },
            { new: true }
        ).select("-password");
        return res.status(200).json(user);


    } catch (error) {
        return res.status(400).json({ message: "update assistasnt error" });
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = await User.findById(req.userId);
        user.history.push(command);
        await user.save();
        const assistantName = user.assistantName;
        const userName = user.name;

        const result = await geminiResponse(command, assistantName, userName);
        const jsonMatch = result.match(/{[\s\S]*}/);

        if (!jsonMatch) {
            return res.status(400).json({ message: "I'm sorry I can't understand" });
        }
        const geminiResult = JSON.parse(jsonMatch[0]);
        const type = geminiResult.type;

        switch (type) {
            case "get-date":
                return res.json({
                    type,
                    userInput: geminiResult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}`
                });
            case "get-time":
                return res.json({
                    type,
                    userInput: geminiResult.userInput,
                    response: `current time is ${moment().format("hh:mm A")}`
                });
            case "get-day":
                return res.json({
                    type,
                    userInput: geminiResult.userInput,
                    response: `today is ${moment().format("dddd")}`
                });
            case "get-month":
                return res.json({
                    type,
                    userInput: geminiResult.userInput,
                    response: `today is ${moment().format("MMMM")}`
                });
            case 'google-search':
            case 'youtube-search':
            case 'youtube-play':
            case 'general':
            case 'calculator-open':
            case 'instagram-open':
            case 'facebook-open':
            case 'weather-show':
                return res.json({
                    type,
                    userInput: geminiResult.userInput,
                    response: geminiResult.response,
                });
            default:
                return res.json({ response: "I did not understand that command." });
        }
    } catch (error) {
        return res.status(500).json({ response: "ask assistant error." });
    }
}