import {Icons} from "@/components/icons";

type NavItem = {
    title: string;
    href: string;
    icon: keyof typeof Icons;
    disabled?: boolean;
    external?: boolean;
}

type SidebarNavItem = {
    title: string;
    href: string;
    icon: keyof typeof Icons;
    disabled?: boolean;
    external?: boolean;
} & (
    | {
        href: string;
        items?: never;
    }
    | {
        href? : string;
        items: NavItem[];
    }
)