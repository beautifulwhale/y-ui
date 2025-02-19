import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "../index";

describe("Input", () => {
    it("renders with placeholder", () => {
        const { getByPlaceholderText } = render(
            <Input placeholder="输入内容" />
        );
        expect(getByPlaceholderText("输入内容")).toBeDefined();
    });

    it("handles value changes", () => {
        const handleChange = vi.fn();
        const { getByTestId } = render(
            <Input onChange={handleChange} placeholder="输入内容" />
        );

        fireEvent.change(getByTestId("custom-input"), {
            target: { value: "测试" },
        });

        expect(handleChange).toHaveBeenCalledWith("测试");
    });
});
