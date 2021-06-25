import {
  Arg,
  InputType,
  Mutation,
  Query,
  Resolver,
  Field,
  ObjectType,
  Ctx,
} from "type-graphql";
import { User } from "../entities/User";
import argon2 from "argon2";
import { MyContext } from "../types";

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

@ObjectType()
class FieldError {
  @Field()
  field!: string;

  @Field()
  message!: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) return null;

    const user = await User.findOne(req.session.userId);
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ) {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Length must be greater than 2.",
          },
        ],
      };
    }

    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "Length must be greater than 3.",
          },
        ],
      };
    }

    try {
      const existingUser = await User.findOne({
        where: { username: options.username },
      });

      if (existingUser) {
        return {
          errors: [
            {
              field: "username",
              message: "Username already exists.",
            },
          ],
        };
      }

      const hashedPassword = await argon2.hash(options.password);

      const user = await User.create({
        username: options.username,
        password: hashedPassword,
      }).save();

      req.session.userId = user.id;

      return { user };
    } catch (error) {
      console.error(error);
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ) {
    try {
      const user = await User.findOne({
        where: { username: options.username },
      });

      if (!user) {
        return {
          errors: [
            {
              field: "username",
              message: "Username doesn't exist.",
            },
          ],
        };
      }

      const valid = await argon2.verify(user.password, options.password);

      if (!valid) {
        return {
          errors: [
            {
              field: "password",
              message: "Incorrect password.",
            },
          ],
        };
      }

      req.session.userId = user.id;

      return { user };
    } catch (error) {
      console.error(error);
    }
  }
}
