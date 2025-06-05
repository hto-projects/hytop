import { Container, Card, Button } from "react-bootstrap";

const Hero = () => {
  return (
    <div className=" py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
          <h1 className="text-center mb-4">HYLAND TECH OUTREACH PORTAL</h1>
          <p className="text-center mb-4">
            Welcome to the Hyland Tech Outreach Portal. Here, you can build and
            host your own websites.
          </p>
          <div className="d-flex">
            <Button variant="secondary" href="/create-project">
              Create Project
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
