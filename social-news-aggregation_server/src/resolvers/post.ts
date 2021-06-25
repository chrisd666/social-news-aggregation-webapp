import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts() {
    return await Post.find();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id") id: number) {
    return await Post.findOne(id);
  }

  @Mutation(() => Post)
  async createPost(@Arg("title") title: string) {
    try {
      return await Post.create({ title }).save();
    } catch (error) {
      console.error(error);
    }
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(@Arg("id") id: number, @Arg("title") title: string) {
    await Post.update(id, { title });

    return await Post.findOne(id);
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number) {
    const deletedPost = await Post.delete(id);

    return deletedPost ? true : false;
  }
}
