import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button component", () => {
    test("renders with primary variant by default", () => {
        render(<Button>Click me</Button>);
        const buttonElement = screen.getByRole("button", { name: /click me/i });
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass("bg-blue-600");
        expect(buttonElement).toHaveClass("hover:bg-blue-700");
    });

    test("renders with danger variant", () => {
        render(<Button variant="danger">Delete</Button>);
        const buttonElement = screen.getByRole("button", { name: /delete/i });
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass("bg-red-600");
        expect(buttonElement).toHaveClass("hover:bg-red-700");
    });

    test("calls onClick when clicked", async () => {
        const onClickMock = jest.fn();
        render(<Button onClick={onClickMock}>Click me</Button>);
        const buttonElement = screen.getByRole("button", { name: /click me/i });

        await userEvent.click(buttonElement);
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });
});
