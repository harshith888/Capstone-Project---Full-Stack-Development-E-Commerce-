import React from 'react'

const ReturnPolicy = () => {
  return (
    <div className="mt-16 pb-16 max-w-4xl">
      <div className="flex flex-col items-start mb-8">
        <p className="text-2xl font-medium uppercase">Return & Refund Policy</p>
        <div className="w-16 h-0.5 bg-black rounded-full mt-2"></div>
      </div>

      <div className="space-y-4 text-gray-700">
        <p>
          At Grewcery we want you to be completely satisfied with your purchase. If
          the product delivered to you is defective, damaged, or not as
          described, you may request a return within 48 hours of delivery.
        </p>

        <h3 className="font-semibold">Eligibility</h3>
        <ul className="list-disc pl-6">
          <li>Product must be unused (where applicable) and in original packaging.</li>
          <li>Perishable items may only be returned if they are received damaged or spoiled.</li>
          <li>Returns requested after 48 hours may be rejected except in exceptional cases.</li>
        </ul>

        <h3 className="font-semibold">How to Request a Return</h3>
        <ol className="list-decimal pl-6">
          <li>Go to <strong>My Orders</strong> in your account and select the order.</li>
          <li>Click the <strong>Request Return</strong> button next to the item (or contact our support).</li>
          <li>Provide photos/descriptions for damaged or incorrect items.</li>
        </ol>

        <h3 className="font-semibold">Refunds</h3>
        <p>
          Refunds will be processed within 5-7 business days after the returned
          item is received and inspected. Refunds will be issued to the original
          payment method. Shipping charges are non-refundable unless the return
          is due to our error.
        </p>

        <h3 className="font-semibold">Contact</h3>
        <p>
          If you need help, contact our support team via the <strong>Contact Us</strong> link in the footer with your order ID and details.
        </p>

        <p className="text-sm text-gray-500">This is a standard policy—your final eligibility may vary by product and seller.</p>
      </div>
    </div>
  )
}

export default ReturnPolicy
