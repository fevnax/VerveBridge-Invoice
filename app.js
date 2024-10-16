import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// Helper function to format the current date
const formatCurrentDate = () => {
    let currDate = new Date();
    let year = currDate.getFullYear();
    let month = currDate.getMonth() + 1;
    let day = currDate.getDate();
    return `${day} / ${month} / ${year}`;
};

// Rendering the purchase page (assumed form for input)
app.get("/", (req, res) => {
    res.render("purchase");
});

app.post("/invoice", (req, res) => {
    // Retrieving form data
    const customerName = req.body.customerName;
    const customerAddress = req.body.customerAddress;
    const accountNumber = req.body.accountNumber;
    const accountName = req.body.accountName;
    const otherDetails = req.body.otherDetails;

    // Handling multiple items
    const items = [];
    let subtotal = 0;
    
    // Iterating over the item data
    for (let i = 0; i < req.body.itemName.length; i++) {
        const price = parseFloat(req.body.itemPrice[i]);
        const quantity = parseInt(req.body.quantity[i]);
        
        // Calculate the total for each item
        const total = price * quantity;

        // Add the total to subtotal
        subtotal += total;

        // Push the item object to items array
        items.push({
            name: req.body.itemName[i],
            price: price,
            quantity: quantity,
            total: total
        });
    }

    // Calculating tax (example: 10% tax)
    const tax = subtotal * 0.18;

    // Final total (subtotal + tax)
    const finalTotal = subtotal + tax;

    // Get the current date
    const date = formatCurrentDate();

    // Render the invoice template with all required data
    res.render("invoice", {
        customerName,
        customerAddress,
        accountNumber,
        accountName,
        otherDetails,
        items,
        subtotal: subtotal.toFixed(2),  // Send subtotal
        tax: tax.toFixed(2),            // Send tax
        total: finalTotal.toFixed(2),   // Send final total
        date                            // Send current date
    });
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
