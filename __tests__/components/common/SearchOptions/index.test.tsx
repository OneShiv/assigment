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
            id: "label1",
          },
          {
            label: "label2",
            symbol: "label2",
            id: "label2",
          },
        ]}
        optionIndex={-1}
        noOptions={false}
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
  it("should not show if  noOptions field is true", () => {
    render(
      <SearchOptions
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
        optionIndex={-1}
        noOptions={true}
        onClickHandler={mockClickHandler}
      />
    );
    expect(screen.queryByText("label1")).not.toBeInTheDocument();
  });
});
