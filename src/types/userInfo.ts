// types/UserInfo.ts

export interface UserAttrs {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    placeOfBirth: string;
    country: string;
    addressStreet: string;
    addressComplementStreet: string;
    addressPostalCode: string;
    addressCity: string;
    addressCountry: string;
    email: string;
    Phone: string;
    emergencyFirstName: string;
    emergencyLastName: string;
    emergencyAffiliation: string;
    emergencyTel: string;
  }
  export interface UserInfo {
    login: string;
    totalUp: number;
    totalDown: number;
    attrs: UserAttrs;
  }
  