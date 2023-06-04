import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AutoComplete from "../../../src/components/AutoComplete";
import userEvent from "@testing-library/user-event";

describe("[Component: Autocomplete]", () => {
  it("should render autocomplete and provide basic functionality", async () => {
    const mockSelectValue = jest.fn();
    render(
      <AutoComplete
        label="Find a Symbol"
        options={[
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
        ]}
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
    });
  });
});
