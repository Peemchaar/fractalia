import { TagLan } from "./tagLan";

export class PartnerServiceConfig {
  internalName: string;
  icon: string;
  iconId: Number;
  category: string;
  categoryId: Number;
  denyEmployeeAccess: boolean;
  tags: TagLan[];
}
