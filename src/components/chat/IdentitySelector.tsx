import Select from "../ui/Select";
import { chatParentDomains } from "../../config/tezos";

interface IdentitySelectorProps {
    domains: string[];
    activeDomain: string;
    onSwitch: (domain: string) => void;
}

/** Strip a known parent domain (wtf.tez, hack.tez, etc.) to show just the label(s) */
function shortLabel(domain: string): string {
    for (const parent of chatParentDomains) {
        const suffix = `.${parent}`;
        if (domain.endsWith(suffix)) return domain.slice(0, -suffix.length);
    }
    return domain;
}

export default function IdentitySelector({ domains, activeDomain, onSwitch }: IdentitySelectorProps) {
    if (domains.length <= 1) {
        return (
            <span
                className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2 gap-1"
                style={{
                    background: "var(--accent, #00ffc8)",
                    color: "var(--bg, #000)",
                    fontFamily: "var(--font-mono)",
                    minHeight: "28px",
                    letterSpacing: "0.12em",
                    maxWidth: "clamp(60px, 20vw, 120px)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
                title={activeDomain}
                aria-label={`Active identity: ${activeDomain}`}
            >
                {shortLabel(activeDomain)}
            </span>
        );
    }

    const options = domains.map((d) => ({ value: d, label: shortLabel(d) }));

    return (
        <Select
            options={options}
            value={activeDomain}
            onChange={onSwitch}
            variant="accent"
            id="identity-selector"
            aria-label="Active identity"
        />
    );
}
