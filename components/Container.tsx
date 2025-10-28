interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <main className="container max-w-7xl mx-auto px-4 md:px-6 flex-grow">
      {children}
    </main>
  );
};

export default Container;
