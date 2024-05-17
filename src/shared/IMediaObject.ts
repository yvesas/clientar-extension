import { MediaType } from "./MediaType"

export interface IMediaObject {
  id: string 
  message: string | null,
  type: MediaType
}