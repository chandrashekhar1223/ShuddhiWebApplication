import { Vendor } from "./LoadVendorService";

export interface PickupRequest {
  name: string;
  photoPath: string | null;
  quantity: number;
  status: string | null;
  address: string;
  wasteTypeId: number;
  sub_Waste_Type: String;
  note: string | null;
  latitude: string | null;
  longitude: string | null;
  totalEstimatedWaste: number | null;
  pickupRequestId: number;
  createdDate: string;
  assign: string | null;
  pincode: string;
  vendorName?: string;
  vendor_Id?:number;
  selectedVendor?: Vendor | null;
  society:string;
  pickupDateTime: Date | null ;
 society_Id?: number | null;
}