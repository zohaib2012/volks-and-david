import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { success } from "../../utils/response";
import * as usaServicesService from "./usa-services.service";

export const applyLLC = asyncHandler(async (req: Request, res: Response) => {
  const result = await usaServicesService.createApplication(req.user!.userId, "LLC", req.body);
  return success(res, result, "LLC application submitted", 201);
});

export const applyEIN = asyncHandler(async (req: Request, res: Response) => {
  const result = await usaServicesService.createApplication(req.user!.userId, "EIN", req.body);
  return success(res, result, "EIN application submitted", 201);
});

export const applyITIN = asyncHandler(async (req: Request, res: Response) => {
  const result = await usaServicesService.createApplication(req.user!.userId, "ITIN", req.body);
  return success(res, result, "ITIN application submitted", 201);
});

export const applyBank = asyncHandler(async (req: Request, res: Response) => {
  const result = await usaServicesService.createApplication(req.user!.userId, "BANK", req.body);
  return success(res, result, "Bank account application submitted", 201);
});

export const applyPackage = asyncHandler(async (req: Request, res: Response) => {
  const result = await usaServicesService.createApplication(req.user!.userId, "PACKAGE", req.body);
  return success(res, result, "Package application submitted", 201);
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await usaServicesService.getApplications(req.user!.userId);
  return success(res, result);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const result = await usaServicesService.getApplication(req.user!.userId, req.params.id);
  return success(res, result);
});
