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
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "../common/interfaces/response.interface";
import { User, UsersCreate, UsersReplace, UsersSearch, UsersUpdate } from "./api/users.interface";
import { UsersService } from "./users.service";
import { arrayResponseSchema, responseSchema } from "src/common/swagger/schema.helper";

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

  @Patch(":id")
  @ApiOperation({
    summary: "Updates a user",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "User Updated", schema: responseSchema(Response, "data", User) })
  @ApiNotFoundResponse({ description: "Not Found" })
  @ApiBadRequestResponse({ description: "User update failed. An error message will be returned" })
  async update(@Param("id") id: string, @Body() dto: UsersUpdate): Promise<Response<User>> {
    const updated = await this.usersService.update(id, dto);
    if (!updated) {
      throw new NotFoundException("user not found");
    }
    return Response.forData(updated);
  }

  @Put(":id")
  @ApiOperation({
    summary: "Create or replace a user",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: "User Updated" })
  @ApiNotFoundResponse({ description: "Not Found" })
  @ApiBadRequestResponse({ description: "User update failed. An error message will be returned" })
  async replace(@Param("id") id: string, @Body() dto: UsersReplace): Promise<void> {
    if (id != dto.id) {
      throw new BadRequestException("User id does not match with request id");
    }
    await this.usersService.update(id, dto);
  }

  @Get()
  @ApiOperation({
    summary: "Search users by their fields: first_name, email",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "Search results returned", schema: arrayResponseSchema(Response, "data", User) })
  @ApiBadRequestResponse({ description: "Users search failed. An error message will be returned" })
  async search(
    @Query()
    query: UsersSearch,
  ): Promise<Response<User[]>> {
    const found = await this.usersService.search(query);
    return Response.forData(found);
  }
}
