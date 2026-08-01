import Container from "@/core/components/ui/Container";
const NotFoundPage = () => {
  return (
    <Container className="flex flex-col items-center justify-center min-h-screen">
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </Container>
  );
};

export default NotFoundPage;
