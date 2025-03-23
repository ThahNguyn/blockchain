const Web3 = require("web3");
const express = require("express");
const app = express();

app.use(express.json());

// Kết nối với Ganache
const web3 = new Web3("http://127.0.0.1:7545");

// Địa chỉ contract và ABI từ Remix
const contractAddress = "0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3";
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "student", "type": "address" },
            { "indexed": true, "internalType": "uint256", "name": "teacherId", "type": "uint256" },
            { "indexed": false, "internalType": "uint8", "name": "score", "type": "uint8" },
            { "indexed": false, "internalType": "string", "name": "comment", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "name": "EvaluationAdded",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "teacherId", "type": "uint256" },
            { "internalType": "uint8", "name": "score", "type": "uint8" },
            { "internalType": "string", "name": "comment", "type": "string" }
        ],
        "name": "addEvaluation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "student", "type": "address" }
        ],
        "name": "addToWhitelist",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "teacherId", "type": "uint256" }
        ],
        "name": "calculateAverageScore",
        "outputs": [
            { "internalType": "uint8", "name": "", "type": "uint8" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "evaluationCount",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "name": "evaluations",
        "outputs": [
            { "internalType": "uint256", "name": "id", "type": "uint256" },
            { "internalType": "address", "name": "student", "type": "address" },
            { "internalType": "uint256", "name": "teacherId", "type": "uint256" },
            { "internalType": "uint8", "name": "score", "type": "uint8" },
            { "internalType": "string", "name": "comment", "type": "string" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "id", "type": "uint256" }
        ],
        "name": "getEvaluation",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "id", "type": "uint256" },
                    { "internalType": "address", "name": "student", "type": "address" },
                    { "internalType": "uint256", "name": "teacherId", "type": "uint256" },
                    { "internalType": "uint8", "name": "score", "type": "uint8" },
                    { "internalType": "string", "name": "comment", "type": "string" },
                    { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
                ],
                "internalType": "struct TeacherEvaluation.Evaluation",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "name": "whitelist",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
;

const contract = new web3.eth.Contract(contractABI, contractAddress);

// API thêm đánh giá
app.post("/addEvaluation", async (req, res) => {
    const { teacherId, score, comment } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        const from = accounts[0]; // Chọn tài khoản đầu tiên trong Ganache

        const receipt = await contract.methods
            .addEvaluation(teacherId, score, comment)
            .send({ from });

        res.json({ status: "success", receipt });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
});

// API lấy thông tin đánh giá
app.get("/getEvaluation/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const evaluation = await contract.methods.getEvaluation(id).call();
        res.json({ status: "success", evaluation });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
});

// Khởi chạy server
const port = 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
