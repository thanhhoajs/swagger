<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1_M5tYoaKfXpqsOAPQl3WVWs9u5NWrG76" alt="ThanhHoa Logo" width="300"/>
</p>

# @thanhhoajs/swagger

## Key Features

- **Decorators for API Documentation**

  - `@ApiOperation()` - Define operation metadata
  - `@ApiTags()` - Group endpoints by tags
  - `@ApiParam()`, `@ApiQuery()` - Document route and query parameters
  - `@ApiBody()` - Document request body schema
  - `@ApiResponse()` - Document response schemas

- **Security Scheme Support**

  - `@ApiBasicAuth()` - Basic authentication
  - `@ApiBearerAuth()` - JWT bearer token authentication
  - `@ApiOAuth2()` - OAuth2 flows support
  - `@ApiSecurity()` - Custom security schemes

- **Schema Documentation**

  - `@ApiModel()` - Document data models/DTOs
  - `@ApiProperty()` - Document model properties
  - Automatic type inference for TypeScript types

- **Parameter Documentation**

  - `@ApiHeader()` - Document HTTP headers
  - `@ApiCookieParam()` - Document cookie parameters

- **Easy Integration**
  - Simple setup with `setupSwagger()` function
  - Automatic OpenAPI specification generation
  - Built-in Swagger UI
  - JSON schema export

## Installation

Install ThanhHoa using Bun:

```bash
bun add @thanhhoajs/swagger
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/thanhhoajs/swagger).

## Author

Nguyen Nhu Khanh <kwalker.nnk@gmail.com>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
