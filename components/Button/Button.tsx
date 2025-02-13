"use client";
import React from "react";

type ButtonProps = {
    onClick?: () => void;
    children: React.ReactNode;
    variant?: "primary" | "danger";
    className?: string;
};

export default function Button({
    onClick,
    children,
    variant = "primary",
    className = "",
}: ButtonProps) {
    const baseStyles =
        "flex items-center justify-center w-full p-[0.5rem] md:p-[0.8rem] text-sm md:text-base text-white font-semibold rounded-lg transition-all duration-200";

    const variantStyles =
        variant === "danger"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700";

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {children}
        </button>
    );
}
