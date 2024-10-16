import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("purchase");
});

const formatCurrentDate = () => {
    let currDate = new Date();
    let year = currDate.getFullYear();
    let month = currDate.getMonth() + 1;
    let day = currDate.getDate();
    return `${day} / ${month} / ${year}`;
};

app.post("/invoice", (req, res) => {
   
    const customerName = req.body.customerName;
    const customerAddress = req.body.customerAddress;
    const accountNumber = req.body.accountNumber;
    const accountName = req.body.accountName;
    const otherDetails = req.body.otherDetails;

    // Handling multiple items
    const items = [];
    for (let i = 0; i < req.body.itemName.length; i++) {
        const price = parseFloat(req.body.itemPrice[i]);
        const quantity = parseInt(req.body.quantity[i]);
        const total = price * quantity;

        items.push({
            name: req.body.itemName[i],
            price: price,
            quantity: quantity,
            total: total
        });
    }

    const date = formatCurrentDate();

    res.render("invoice", {
        customerName,
        customerAddress,
        accountNumber,
        accountName,
        otherDetails,
        items,
        date
    });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
