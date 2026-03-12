"use client";

import Image from "next/image";
import { useState } from "react";
import PayButton from "./payButton";

export default function AcheterTicketsPage() {
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

    return (
        <div className="min-h-screen mt-30 mb-30 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Acheter vos tickets
                    </h1>

                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                        Choisissez votre moyen de paiement
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white shadow-xl rounded-xl p-6">

                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                        Moyens de paiement
                    </h3>

                    <div className="space-y-3">

                        {/* Masrvi */}
                        <div
                            onClick={() => setSelectedPayment("masrvi")}
                            className={`flex items-center justify-center border rounded-lg p-3 cursor-pointer transition
                            ${selectedPayment === "masrvi"
                                ? "border-black bg-gray-100"
                                : "hover:bg-gray-50"}
                            `}
                        >
                            <Image
                                src="/images/payment/masrvi.png"
                                alt="Masrvi"
                                width={110}
                                height={50}
                            />
                        </div>

                        {/* Bankily */}
                        <div
                            onClick={() => setSelectedPayment("bankily")}
                            className={`flex items-center justify-center border rounded-lg p-3 cursor-pointer transition
                            ${selectedPayment === "bankily"
                                ? "border-black bg-gray-100"
                                : "hover:bg-gray-50"}
                            `}
                        >
                            <Image
                                src="/images/payment/bankily.png"
                                alt="Bankily"
                                width={110}
                                height={50}
                            />
                        </div>

                    </div>

                    {/* Bouton */}
                    <div className="mt-6">
                        <PayButton selectedPayment={selectedPayment} />
                    </div>

                </div>

            </div>

        </div>
    );
}