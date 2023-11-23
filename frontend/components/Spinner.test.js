// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import Spinner from "./Spinner"
import '@testing-library/jest-dom/extend-expect';

test('sanity', () => {
  expect(false).toBe(false)
})

test('Renders when passed ON prop true ', async () => {
  render(<Spinner on={true} />);
  const spinner = await screen.findByTestId('spinner');
  expect(spinner).toBeInTheDocument();
});

test("Doesn't render when passed ON prop false", async () => {
  render(<Spinner on={false} />);
  await waitFor(() => {
    const spinner = screen.queryByTestId('spinner');
    expect(spinner).not.toBeInTheDocument();
  });
});