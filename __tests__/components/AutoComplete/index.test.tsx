import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AutoComplete from "../../../src/components/AutoComplete";
import userEvent from "@testing-library/user-event";
const options = [
  {
    label: "label1",
    symbol: "label1",
    id: "label1",
  },
  {
    label: "label2",
    symbol: "label2",
    id: "label2",
  },
];

describe("[Component: Autocomplete]", () => {
  it("should give active class to first list item", async () => {
    const mockSelectValue = jest.fn();
    const mockOnEnter = jest.fn();
    render(
      <AutoComplete
        value="test"
        label="Find a Symbol"
        options={options}
        setValue={mockSelectValue}
        onEnter={mockOnEnter}
      />
    );
    const inptEl = screen.getByLabelText("Find a Symbol");

    expect(inptEl).toBeInTheDocument();
    userEvent.type(inptEl, "test{ArrowDown}");

    await waitFor(() => {
      expect(screen.getByText("label1").classList).toContain("active");
      userEvent.clear(inptEl);
    });
  });

  it("should give active class to last list item if arrowup pressed", async () => {
    const mockSelectValue = jest.fn();
    const mockOnEnter = jest.fn();
    render(
      <AutoComplete
        value="test"
        label="Find a Symbol"
        options={options}
        setValue={mockSelectValue}
        onEnter={mockOnEnter}
      />
    );
    const inptEl = screen.getByLabelText("Find a Symbol");

    expect(inptEl).toBeInTheDocument();
    userEvent.type(inptEl, "a{ArrowUp}");

    await waitFor(() => {
      expect(screen.getByText("label2").classList).toContain("active");
      userEvent.clear(inptEl);
    });
  });

  it("should call callback with empty text to that parent component can navigate accordingly", async () => {
    const mockSelectValue = jest.fn();
    const mockOnEnter = jest.fn();
    render(
      <AutoComplete
        value="test"
        label="Find a Symbol"
        options={options}
        setValue={mockSelectValue}
        onEnter={mockOnEnter}
      />
    );
    const inptEl = screen.getByLabelText("Find a Symbol");

    expect(inptEl).toBeInTheDocument();
    userEvent.click(inptEl);
    userEvent.type(inptEl, "{enter}");
    await waitFor(() => {
      expect(mockOnEnter).toHaveBeenCalled();
    });
  });

  it("should not show list if focus removed from input", async () => {
    const mockSelectValue = jest.fn();
    const mockOnEnter = jest.fn();
    render(
      <AutoComplete
        value="test"
        label="Find a Symbol"
        options={options}
        setValue={mockSelectValue}
        onEnter={mockOnEnter}
      />
    );
    const inptEl = screen.getByLabelText("Find a Symbol");
    userEvent.click(inptEl);
    userEvent.click(document.body);

    await waitFor(
      () => {
        expect(screen.queryByText("label1")).not.toBeInTheDocument();
      },
      {
        timeout: 2000,
      }
    );
  });
});
