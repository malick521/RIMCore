"use client";

import Image from "next/image";
import { useState } from "react";
import PayButton from "./payButton"; // Client Component

export default function AcheterTicketsPage() {
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
   

    return (
        <div className="flex flex-col mt-20 items-center justify-center min-h-screen px-4">
            <h1 className="text-3xl font-bold mb-6">Acheter vos Tickets</h1>
            <p className="mt-4 text-lg text-gray-600 mb-7">D'autres moyens de paiments seront implementés !</p>

            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Moyens de paiement</h3>


                <div className="grid grid-cols-2 gap-4">
                    {/* Masrvi */}
                    <div
                        onClick={() => setSelectedPayment("masrvi")}
                        className={`border rounded-xl p-4 flex items-center justify-center cursor-pointer transition
                            ${selectedPayment === "masrvi"
                                ? "border-primary bg-primary/10 shadow-md"
                                : "hover:shadow-md"}
                        `}
                    >
                        <Image
                            src="/images/payment/masrvi.png"
                            alt="Masrvi"
                            width={120}
                            height={60}
                        />
                    </div>

                    {/* Bankily */}
                    <div
                        onClick={() => setSelectedPayment("bankily")}
                        className={`border rounded-xl p-4 flex items-center justify-center cursor-pointer transition
                            ${selectedPayment === "bankily"
                                ? "border-primary bg-primary/10 shadow-md"
                                : "hover:shadow-md"}
                        `}
                    >
                        <Image
                            src="/images/payment/bankily.png"
                            alt="Bankily"
                            width={120}
                            height={60}
                        />
                    </div>
                </div>

                {/* Bouton Client pour payer */}
                <PayButton selectedPayment={selectedPayment} />
            </div>
        </div>
    );
}
