import "@testing-library/jest-dom";
import "jest-fetch-mock";

jest.mock("next/router", () => require("next-router-mock"));
global.fetch = require("jest-fetch-mock");
