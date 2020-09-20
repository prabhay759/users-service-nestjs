import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "../common/interfaces/response.interface";
import { User, UsersCreate, UsersUpdate } from "./api/users.interface";
import { UsersService } from "./users.service";
import { arrayResponseSchema, responseSchema } from "src/common/swagger/schema.helper";
import { verify } from "../common/verify/verifier";

@Injectable()
@Controller("users")
@ApiTags("users")
@ApiExtraModels(User)
export class UsersController {
  constructor(private usersService: UsersService, private config: ConfigService) {}

  private get maxResults() {
    return this.config.get<number>("USERS_MAX_RESULT_COUNT") || 50;
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get user by id" })
  @ApiOkResponse({
    description: "Found User",
    schema: responseSchema(Response, "data", User),
  })
  @ApiNotFoundResponse({ description: "Not Found" })
  async get(@Param("id") id: string): Promise<Response<User>> {
    const resource = await this.usersService.get(id);
    if (!resource) {
      throw new NotFoundException("user not found");
    }
    return Response.forData(resource);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete user by id" })
  @ApiOkResponse({
    description: "User Created",
  })
  @ApiNotFoundResponse({ description: "Not Found" })
  async delete(@Param("id") id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new user" })
  @ApiCreatedResponse({
    description: "User Created",
    schema: responseSchema(Response, "data", User),
  })
  @ApiBadRequestResponse({ description: "User creation failed. An error message will be returned" })
  async create(@Body() dto: UsersCreate): Promise<Response<User>> {
    const created = await this.usersService.create(dto);
    return Response.forData(created);
  }
}
