import Home from "@/containers/Home";
import My from "@/containers/My";
import Page404 from "@/containers/Page404";
import Org from "@/containers/Org";
import NoOrg from "@/containers/NoOrg";
import User from "@/containers/User";
import Course from "@/containers/Course";
import Product from "@/containers/Product";
import { ROUTE_KEY } from "./menus";
import Teacher from "@/containers/Teacher";

export const ROUTE_COMPONENT = {
  [ROUTE_KEY.HOME]: Home,
  [ROUTE_KEY.MY]: My,
  [ROUTE_KEY.ORG]: Org,
  [ROUTE_KEY.COURSE]: Course,
  [ROUTE_KEY.USER]: User,
  [ROUTE_KEY.PRODUCT]: Product,
  [ROUTE_KEY.TEACHER]: Teacher,
  [ROUTE_KEY.NO_ORG]: NoOrg,
  [ROUTE_KEY.PAGE_404]: Page404
}