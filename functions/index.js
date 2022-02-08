const open = require("open");
const path = require("path");
const express = require("express");
const mercadopago = require("mercadopago");

const mercadoPagoPublicKey = process.env.MERCADO_PAGO_SAMPLE_PUBLIC_KEY;
if (!mercadoPagoPublicKey) {
  console.log("Error: public key not defined");
  process.exit(1);
}

const mercadoPagoAccessToken = process.env.MERCADO_PAGO_SAMPLE_ACCESS_TOKEN;
if (!mercadoPagoAccessToken) {
  console.log("Error: access token not defined");
  process.exit(1);
}

mercadopago.configurations.setAccessToken(mercadoPagoAccessToken);

const app = express();

app.set("view engine", "html");
app.engine("html", require("hbs").__express);
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./static"));
app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).render("index", { mercadoPagoPublicKey });
}); 

app.post("/process_payment", (req, res) => {
  const { body } = req;
  const { payer } = body;
  const paymentData = {
    transaction_amount: Number(body.transactionAmount),
    token: body.token,
    description: body.description,
    installments: Number(body.installments),
    payment_method_id: body.paymentMethodId,
    issuer_id: body.issuerId,
    payer: {
      email: payer.email,
      identification: {
        type: payer.identification.docType,
        number: payer.identification.docNumber
      }
    }
  };

  mercadopago.payment.save(paymentData)
    .then(function(response) {
      const { response: data } = response;

      res.status(201).json({
        detail: data.status_detail,
        status: data.status,
        id: data.id
      });
    })
    .catch(function(error) {
      console.log(error);
      const { errorMessage, errorStatus }  = validateError(error);
      res.status(errorStatus).json({ error_message: errorMessage });
    });
});

function validateError(error) {
  let errorMessage = 'Unknown error cause';
  let errorStatus = 400;

  if(error.cause) {
    const sdkErrorMessage = error.cause[0].description;
    errorMessage = sdkErrorMessage || errorMessage;

    const sdkErrorStatus = error.status;
    errorStatus = sdkErrorStatus || errorStatus;
  }

  return { errorMessage, errorStatus };
}

app.listen(3000, () => {
  console.log("The server is now running on port 3000");
  open("http://localhost:3000");
});


/* MERCADO_PAGO_SAMPLE_PUBLIC_KEY=TEST-77aa2dbe-d556-4a44-bd06-fb31cb3ff5a0 MERCADO_PAGO_SAMPLE_ACCESS_TOKEN=TEST-2855653370769129-062909-4db3d16ee58fdb3c026f15bdfdec4664-293253437 npm start
 */