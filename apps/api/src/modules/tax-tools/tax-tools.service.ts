import { prisma } from "../../config/database";

export const taxToolsService = {
  async atlCheck(cnic: string) {
    // Mock: in production, call FBR API
    return {
      cnic,
      isActiveTaxpayer: true,
      status: "ACTIVE",
      category: "A1",
      registeredSince: "2020-01-01",
      lastReturnFiled: "2024-12-31",
      complianceRate: 98.5,
    };
  },

  async ntnStatus(cnic: string) {
    // Mock: in production, call FBR API
    return {
      cnic,
      ntn: "1234567-8",
      name: "John Doe",
      status: "ACTIVE",
      registrationDate: "2020-01-15",
      taxOffice: "RTO Lahore",
      businessType: "Individual",
    };
  },
};
