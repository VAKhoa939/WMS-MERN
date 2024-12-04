import Navbar from "./Navbar";
import Header from "./header/Header";
import "../../../css/general.css";

interface Props {
  children: JSX.Element;
}

const Layout = (props: Props) => {
  return (
    <>
      <Header />
      <Navbar children={props.children} />
    </>
  );
};

export default Layout;
