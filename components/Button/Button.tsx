"use client";
import React from "react";

type ButtonProps = {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
};

export default function Button({
    onClick,
    children,
    className,
}: {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 w-full bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all ${className}`}
        >
            {children}
        </button>
    );
}
