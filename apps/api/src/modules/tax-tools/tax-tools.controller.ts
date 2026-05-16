import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success } from "../../utils/response";

export const atlCheck = asyncHandler(async (req: Request, res: Response) => {
  const { cnic } = req.params;
  return success(res, {
    cnic,
    isActiveTaxpayer: true,
    status: "ACTIVE",
    category: "A1",
    registeredSince: "2020-01-01",
    lastReturnFiled: "2024-12-31",
    complianceRate: 98.5,
  });
});

export const ntnStatus = asyncHandler(async (req: Request, res: Response) => {
  const { cnic } = req.params;
  return success(res, {
    cnic,
    ntn: "1234567-8",
    name: "John Doe",
    status: "ACTIVE",
    registrationDate: "2020-01-15",
    taxOffice: "RTO Lahore",
    businessType: "Individual",
  });
});
