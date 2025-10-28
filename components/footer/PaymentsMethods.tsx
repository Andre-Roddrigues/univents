import Image from "next/image";
import React from "react";
import mpesaLogo from "@/public/images/payments/Mpesalogo.png";
import visaLogo from "@/public/images/payments/visalogo.png";
import masterCardLogo from "@/public/images/payments/masterCardIcon.png";
import emola from "@/public/images/payments/emolalogo.png";
function PaymentsMethods() {
  return (
    <div className="flex gap-3 items-center grayscale ">
      <Image
        src={mpesaLogo}
        alt="Forma de pagamento Mpesa"
        className="h-8 rounded-md w-auto"
      />
      <Image
        src={emola}
        alt="Forma de pagamento emola"
        className="h-8 rounded-md w-auto"
      />
      <Image
        src={visaLogo}
        alt="Forma de pagamento visa"
        className="h-8 w-auto"
      />
      <Image
        src={masterCardLogo}
        alt="Forma de pagamento MasterCard"
        className="h-9 w-auto"
      />
    </div>
  );
}

export default PaymentsMethods;
