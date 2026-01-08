"use client"; // OBLIGATOIRE pour useRouter

import { useRouter } from "next/navigation";

interface PayButtonProps {
    selectedPayment: string | null;
}

export default function PayButton({ selectedPayment }: PayButtonProps) {
    const router = useRouter();

    const handlePayment = () => {
        if (!selectedPayment) return;
        router.push(`/payment?method=${selectedPayment}`);
    };

    return (
        <button
            onClick={handlePayment}
            disabled={!selectedPayment}
            className={`mt-8 w-full py-3 rounded-xl font-semibold transition
                ${
                    selectedPayment
                        ? "bg-primary text-white hover:bg-blue-700 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
        >
            Payer maintenant
        </button>
    );
}
