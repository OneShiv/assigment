import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SearchOptions from "../../../../src/components/common/SearchOptions";
import userEvent from "@testing-library/user-event";

describe("[Component: Search Options", () => {
  const mockClickHandler = jest.fn();
  it("should show if options exist and noOptions field is false, also should execute click handler", async () => {
    render(
      <SearchOptions
        options={[
          {
            label: "label1",
            symbol: "label1",
          },
          {
            label: "label2",
            symbol: "label2",
          },
        ]}
        optionIndex={-1}
        onClickHandler={mockClickHandler}
      />
    );
    expect(screen.getAllByRole("option")).toHaveLength(2);
    let firstEl = screen.getByText("label1");
    userEvent.click(firstEl);
    await waitFor(() => {
      expect(mockClickHandler).toHaveBeenCalled();
    });
  });
  it("should not show if no options", () => {
    render(
      <SearchOptions
        options={[]}
        optionIndex={-1}
        onClickHandler={mockClickHandler}
      />
    );
    expect(screen.queryByText("label1")).not.toBeInTheDocument();
  });
});
