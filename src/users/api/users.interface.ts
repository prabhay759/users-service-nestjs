import * as _ from "lodash";
import { Allow, IsEmail, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Address {
  @Allow()
  @ApiProperty({
    example: "Haupstrasse 46",
  })
  addressLine1: string;

  @Allow()
  @ApiPropertyOptional({
    example: "Apartmen No 5",
  })
  addressLine2?: string;

  @Allow()
  @ApiProperty({
    example: "6020",
  })
  postCode: string;

  @Allow()
  @ApiProperty({
    example: "Luzern",
  })
  city: string;

  @Allow()
  @ApiProperty({
    example: "switzerland",
  })
  country: string;
}

export class User extends Address {
  @Allow()
  @ApiProperty({ example: "dd869563-6819-496f-9400-02bb5c2b7c14" })
  id: string;

  @Allow()
  @ApiProperty({ example: "harry@example.com" })
  email: string;

  @Allow()
  @ApiProperty({ example: "hashPassword" })
  password: string;

  @Allow()
  @ApiProperty({ example: "Prabhay" })
  first_name: string;

  static of(data: User): User {
    const result = new User();
    Object.assign(result, data);
    return result;
  }
}

export class UsersCreate extends Address {
  @Allow()
  @ApiProperty()
  @IsEmail()
  email: string;

  @Allow()
  @ApiProperty()
  @IsString()
  password: string;

  @Allow()
  @ApiProperty()
  @IsString()
  first_name?: string;

  static of(data: UsersCreate): UsersCreate {
    const result = new UsersCreate();
    Object.assign(result, data);
    return result;
  }
}

export class UsersUpdate {
  @Allow()
  @IsEmail()
  @ApiProperty({
    example: "abc@test.com",
  })
  email?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "hashpassword",
  })
  password?: string;

  @Allow()
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "Prabhay",
  })
  first_name?: string;

  @Allow()
  @ApiProperty({
    example: "Haupstrasse 46",
  })
  addressLine1?: string;

  @Allow()
  @ApiPropertyOptional({
    example: "Apartmen No 5",
  })
  addressLine2?: string;

  @Allow()
  @ApiProperty({
    example: "6020",
  })
  postCode?: string;

  @Allow()
  @ApiProperty({
    example: "Luzern",
  })
  city?: string;

  @Allow()
  @ApiProperty({
    example: "switzerland",
  })
  country?: string;

  static of(data: UsersUpdate): UsersUpdate {
    const result = new UsersUpdate();
    Object.assign(result, data);
    return result;
  }
}

export class UsersReplace extends UsersCreate {
  @Allow()
  @ApiProperty()
  @IsString()
  id: string;

  static ofReplace(data: UsersUpdate): UsersUpdate {
    const result = new UsersUpdate();
    Object.assign(result, data);
    return result;
  }
}

export class UsersSearch {
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: "Prabhay@gmail.com",
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "Prabhay",
    required: false,
  })
  first_name?: string;

  static of(data: UsersSearch): UsersSearch {
    const result = new UsersSearch();
    Object.assign(result, data);
    return result;
  }
}
