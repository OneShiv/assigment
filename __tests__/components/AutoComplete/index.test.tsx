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
    render(
      <AutoComplete
        label="Find a Symbol"
        options={options}
        setSelectedValue={mockSelectValue}
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
    render(
      <AutoComplete
        label="Find a Symbol"
        options={options}
        setSelectedValue={mockSelectValue}
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

  it("should render autocomplete and provide basic functionality", async () => {
    const mockSelectValue = jest.fn();

    render(
      <AutoComplete
        label="Find a Symbol"
        options={options}
        setSelectedValue={mockSelectValue}
      />
    );
    const inptEl = screen.getByLabelText("Find a Symbol");

    expect(inptEl).toBeInTheDocument();
    userEvent.type(inptEl, "test");
    await waitFor(() => {
      expect(inptEl).toHaveValue("test");
      inptEl.focus();
    });
    let lb1 = screen.getByText("label1");
    expect(lb1).toBeInTheDocument();
    userEvent.click(lb1);
    await waitFor(() => {
      expect(mockSelectValue).toHaveBeenCalled();
      expect(mockSelectValue).toHaveBeenCalledWith("label1");
      userEvent.clear(inptEl);
    });
  });

  it("should call callback with entered text when enter hit", async () => {
    const mockSelectValue = jest.fn();
    render(
      <AutoComplete
        label="Find a Symbol"
        options={options}
        setSelectedValue={mockSelectValue}
      />
    );
    const inptEl = screen.getByLabelText("Find a Symbol");

    expect(inptEl).toBeInTheDocument();
    userEvent.type(inptEl, "test{enter}");
    await waitFor(() => {
      expect(inptEl).toHaveValue("test");
    });

    await waitFor(() => {
      expect(mockSelectValue).toHaveBeenCalled();
      expect(mockSelectValue).toHaveBeenCalledWith("test");
    });
    userEvent.clear(inptEl);
  });

  it("should not show list if escape pressed", async () => {
    const mockSelectValue = jest.fn();
    render(
      <AutoComplete
        label="Find a Symbol"
        options={options}
        setSelectedValue={mockSelectValue}
      />
    );
    const inptEl = screen.getByLabelText("Find a Symbol");

    expect(inptEl).toBeInTheDocument();
    userEvent.type(inptEl, "test{Escape}");
    await waitFor(() => {
      expect(inptEl).toHaveValue("");
    });

    await waitFor(() => {
      expect(screen.queryByText("label1")).not.toBeInTheDocument();
    });
    userEvent.clear(inptEl);
  });

  it("should not show list if focus removed from input", async () => {
    const mockSelectValue = jest.fn();
    render(
      <AutoComplete
        label="Find a Symbol"
        options={options}
        setSelectedValue={mockSelectValue}
      />
    );
    const inptEl = screen.getByLabelText("Find a Symbol");

    expect(inptEl).toBeInTheDocument();
    userEvent.type(inptEl, "test");
    userEvent.click(document.body);

    await waitFor(() => {
      expect(screen.queryByText("label1")).not.toBeInTheDocument();
    });
    userEvent.clear(inptEl);
  });
});
