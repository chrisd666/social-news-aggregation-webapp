import { NavBar } from "../components/Navbar";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const { data } = usePostsQuery();

  return (
    <>
      <NavBar />
      <div>hello world</div>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </>
  );
};

export default Index;
