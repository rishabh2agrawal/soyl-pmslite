"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { onboardingStepVariants } from "@/lib/motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Globe,
} from "lucide-react";

interface RoomType {
  id: string;
  name: string;
  count: number;
  baseRate: number;
}

interface ManagerEntry {
  id: string;
  phone: string;
}

const STEPS = 5;

const onLabelClass =
  "text-xs text-plum font-medium uppercase tracking-wide";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const {
    setOnboardingComplete,
    setPropertyName,
    setLocale,
    locale,
    onboardingStep,
    setOnboardingStep,
  } = useAppStore();

  const [step, setStep] = useState(onboardingStep || 0);
  const [direction, setDirection] = useState(1);

  // Step 1: Language
  const [selectedLang, setSelectedLang] = useState(locale);

  // Step 2: Property details
  const [property, setProperty] = useState({
    name: "",
    address: "",
    gstin: "",
    phone: "",
    type: "" as string,
  });

  // Step 3: Rooms
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    { id: "1", name: "", count: 1, baseRate: 1000 },
  ]);
  const [autoNumber, setAutoNumber] = useState(true);

  // Step 5: Managers
  const [managers, setManagers] = useState<ManagerEntry[]>([]);
  const [managerPhone, setManagerPhone] = useState("");

  const goNext = useCallback(() => {
    if (step < STEPS - 1) {
      setDirection(1);
      const next = step + 1;
      setStep(next);
      setOnboardingStep(next);
    }
  }, [step, setOnboardingStep]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      const prev = step - 1;
      setStep(prev);
      setOnboardingStep(prev);
    }
  }, [step, setOnboardingStep]);

  const handleComplete = () => {
    setPropertyName(property.name);
    setOnboardingComplete(true);
    router.replace("/app/owner");
  };

  const addRoomType = () => {
    setRoomTypes((prev) => [
      ...prev,
      { id: String(Date.now()), name: "", count: 1, baseRate: 1000 },
    ]);
  };

  const removeRoomType = (id: string) => {
    setRoomTypes((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRoomType = (
    id: string,
    field: keyof RoomType,
    value: string | number,
  ) => {
    setRoomTypes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const addManager = () => {
    if (managerPhone.length >= 10) {
      setManagers((prev) => [
        ...prev,
        { id: String(Date.now()), phone: managerPhone },
      ]);
      setManagerPhone("");
    }
  };

  const removeManager = (id: string) => {
    setManagers((prev) => prev.filter((m) => m.id !== id));
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return property.name.trim() && property.phone.length >= 10;
      case 2:
        return roomTypes.some((r) => r.name.trim() && r.count > 0);
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const languages = [
    { code: "en" as const, label: "English", script: "Aa" },
    { code: "hi" as const, label: "हिन्दी", script: "अ" },
    { code: "kn" as const, label: "ಕನ್ನಡ", script: "ಅ" },
  ];

  const propertyTypes = [
    { value: "hotel", label: "Hotel" },
    { value: "homestay", label: "Homestay" },
    { value: "guesthouse", label: "Guesthouse" },
    { value: "lodge", label: "Lodge" },
  ];

  const totalRooms = roomTypes.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Progress */}
      <div className="glass-heavy safe-area-pt sticky top-0 z-10 border-b border-white/[0.06] px-4 pb-2 pt-4 shadow-[0_1px_0_rgba(255,255,255,0.04)]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-plum">
            {step + 1} / {STEPS}
          </span>
        </div>
        <Progress value={((step + 1) / STEPS) * 100} className="h-1.5 bg-white/[0.08]" />
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-hidden px-4 py-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={onboardingStepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="space-y-6"
          >
            <div className="liquid-glass rounded-2xl border-0 px-4 py-6">
            {step === 0 && (
              <StepWelcome
                languages={languages}
                selectedLang={selectedLang}
                onSelect={(code) => {
                  setSelectedLang(code);
                  setLocale(code);
                }}
                t={t}
              />
            )}
            {step === 1 && (
              <StepProperty
                property={property}
                setProperty={setProperty}
                propertyTypes={propertyTypes}
                t={t}
              />
            )}
            {step === 2 && (
              <StepRooms
                roomTypes={roomTypes}
                autoNumber={autoNumber}
                setAutoNumber={setAutoNumber}
                addRoomType={addRoomType}
                removeRoomType={removeRoomType}
                updateRoomType={updateRoomType}
                totalRooms={totalRooms}
                t={t}
              />
            )}
            {step === 3 && (
              <StepRates roomTypes={roomTypes} updateRoomType={updateRoomType} t={t} />
            )}
            {step === 4 && (
              <StepRoles
                managers={managers}
                managerPhone={managerPhone}
                setManagerPhone={setManagerPhone}
                addManager={addManager}
                removeManager={removeManager}
                t={t}
              />
            )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="glass-heavy safe-area-pb sticky bottom-0 flex items-center gap-3 border-t border-white/[0.06] px-4 py-3 shadow-[0_-12px_30px_rgba(0,0,0,0.35)]">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={goBack}
            className="gap-2 border border-white/[0.09] bg-white/[0.03] font-medium text-chalk hover:bg-white/[0.07]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
        )}
        <div className="flex-1" />
        {step < STEPS - 1 ? (
          <Button
            onClick={goNext}
            disabled={!canProceed()}
            className="gap-2 bg-teal font-semibold text-ink shadow-glow hover:bg-chalk"
          >
            {t("next")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            className="gap-2 bg-teal font-semibold text-ink shadow-glow hover:bg-chalk"
          >
            <Check className="h-4 w-4" />
            {t("finish")}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ---------- Step sub-components ---------- */

function StepWelcome({
  languages,
  selectedLang,
  onSelect,
  t,
}: {
  languages: { code: "en" | "hi" | "kn"; label: string; script: string }[];
  selectedLang: string;
  onSelect: (code: "en" | "hi" | "kn") => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl liquid-glass ring-1 ring-teal/15">
        <Globe className="size-8 text-teal" />
      </div>
      <h1 className="text-2xl font-bold text-chalk">{t("welcomeTitle")}</h1>
      <p className="mt-2 text-sm text-plum">{t("welcomeSubtitle")}</p>

      <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            type="button"
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
              selectedLang === lang.code
                ? "border-2 border-teal/50 bg-teal/10 text-chalk shadow-glow-sm"
                : "border border-white/[0.08] bg-white/[0.02] text-plum hover:border-white/[0.16]",
            )}
          >
            <span className="text-2xl font-bold text-chalk">
              {lang.script}
            </span>
            <span className="text-sm font-medium">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepProperty({
  property,
  setProperty,
  propertyTypes,
  t,
}: {
  property: { name: string; address: string; gstin: string; phone: string; type: string };
  setProperty: React.Dispatch<React.SetStateAction<typeof property>>;
  propertyTypes: { value: string; label: string }[];
  t: ReturnType<typeof useTranslations>;
}) {
  const update = (field: string, value: string) =>
    setProperty((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-chalk">{t("propertyTitle")}</h2>

      <div className="space-y-2">
        <Label htmlFor="prop-name" className={onLabelClass}>
          {t("propertyName")}
        </Label>
        <Input
          id="prop-name"
          value={property.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder={t("propertyNamePlaceholder")}
          className="min-h-touch"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prop-address" className={onLabelClass}>
          {t("address")}
        </Label>
        <Textarea
          id="prop-address"
          value={property.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder={t("addressPlaceholder")}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prop-phone" className={onLabelClass}>
          {t("phone")}
        </Label>
        <div className="flex overflow-hidden rounded-md">
          <span className="flex items-center border border-r-0 border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-plum">
            +91
          </span>
          <Input
            id="prop-phone"
            value={property.phone}
            onChange={(e) =>
              update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="9876543210"
            className="rounded-none border-l-0"
            inputMode="tel"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className={onLabelClass}>{t("propertyType")}</Label>
        <Select
          value={property.type}
          onValueChange={(v) => update("type", v)}
        >
          <SelectTrigger className="min-h-touch">
            <SelectValue placeholder={t("selectType")} />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((pt) => (
              <SelectItem key={pt.value} value={pt.value}>
                {pt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prop-gstin" className={onLabelClass}>
          {t("gstin")} ({t("optional")})
        </Label>
        <Input
          id="prop-gstin"
          value={property.gstin}
          onChange={(e) => update("gstin", e.target.value.toUpperCase())}
          placeholder="22AAAAA0000A1Z5"
          maxLength={15}
          className="min-h-touch"
        />
      </div>

      <div className="space-y-2">
        <Label className={onLabelClass}>
          {t("logo")} ({t("optional")})
        </Label>
        <Input
          type="file"
          accept="image/*"
          className="min-h-touch cursor-pointer border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-plum file:mr-3 file:rounded-md file:border-0 file:bg-teal/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-teal"
        />
      </div>
    </div>
  );
}

function StepRooms({
  roomTypes,
  autoNumber,
  setAutoNumber,
  addRoomType,
  removeRoomType,
  updateRoomType,
  totalRooms,
  t,
}: {
  roomTypes: RoomType[];
  autoNumber: boolean;
  setAutoNumber: (v: boolean) => void;
  addRoomType: () => void;
  removeRoomType: (id: string) => void;
  updateRoomType: (id: string, field: keyof RoomType, value: string | number) => void;
  totalRooms: number;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-chalk">{t("roomsTitle")}</h2>
        <p className="text-sm text-plum">{t("roomsSubtitle")}</p>
      </div>

      <div className="space-y-4">
        {roomTypes.map((room, idx) => (
          <div key={room.id} className="liquid-glass space-y-3 rounded-xl border-0 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-plum">
                {t("roomType")} {idx + 1}
              </span>
              {roomTypes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoomType(room.id)}
                  className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <Input
              value={room.name}
              onChange={(e) => updateRoomType(room.id, "name", e.target.value)}
              placeholder={t("roomTypePlaceholder")}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className={onLabelClass}>{t("count")}</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="min-h-touch min-w-touch border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.07]"
                    onClick={() =>
                      updateRoomType(room.id, "count", Math.max(1, room.count - 1))
                    }
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold text-chalk">
                    {room.count}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="min-h-touch min-w-touch border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.07]"
                    onClick={() =>
                      updateRoomType(room.id, "count", room.count + 1)
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className={onLabelClass}>{t("baseRate")}</Label>
                <div className="flex overflow-hidden rounded-md">
                  <span className="flex items-center border border-r-0 border-white/[0.08] bg-white/[0.03] px-2 text-xs font-medium text-plum">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={room.baseRate}
                    onChange={(e) =>
                      updateRoomType(room.id, "baseRate", Number(e.target.value))
                    }
                    className="rounded-none border-l-0"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addRoomType}
        className="w-full gap-2 border-white/[0.12] bg-white/[0.03] text-chalk hover:bg-white/[0.07]"
      >
        <Plus className="h-4 w-4" />
        {t("addRoomType")}
      </Button>

      <div className="liquid-glass flex items-center justify-between rounded-xl border-0 px-4 py-3">
        <span className="text-sm text-chalk">{t("autoNumber")}</span>
        <button
          type="button"
          onClick={() => setAutoNumber(!autoNumber)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            autoNumber ? "bg-teal" : "bg-plum/30",
          )}
        >
          <span
            className={cn(
              "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-ink shadow-md transition-transform",
              autoNumber && "translate-x-5",
            )}
          />
        </button>
      </div>

      {totalRooms > 0 && (
        <p className="text-sm text-plum">
          {t("totalRooms")}: <strong className="text-chalk">{totalRooms}</strong>
        </p>
      )}
    </div>
  );
}

function StepRates({
  roomTypes,
  updateRoomType,
  t,
}: {
  roomTypes: RoomType[];
  updateRoomType: (id: string, field: keyof RoomType, value: string | number) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const namedTypes = roomTypes.filter((r) => r.name.trim());

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-chalk">{t("ratesTitle")}</h2>
        <p className="text-sm text-plum">{t("ratesSubtitle")}</p>
      </div>

      {namedTypes.length === 0 ? (
        <p className="text-sm text-plum">{t("noRoomTypes")}</p>
      ) : (
        <div className="space-y-3">
          {namedTypes.map((room) => (
            <div
              key={room.id}
              className="liquid-glass flex items-center justify-between rounded-xl border-0 px-4 py-3"
            >
              <div>
                <p className="font-medium text-chalk">{room.name}</p>
                <p className="text-xs text-plum">
                  {room.count} {room.count === 1 ? "room" : "rooms"}
                </p>
              </div>
              <div className="flex w-32 overflow-hidden rounded-md">
                <span className="flex items-center border border-r-0 border-white/[0.08] bg-white/[0.03] px-2 text-xs font-medium text-plum">
                  ₹
                </span>
                <Input
                  type="number"
                  value={room.baseRate}
                  onChange={(e) =>
                    updateRoomType(room.id, "baseRate", Number(e.target.value))
                  }
                  className="rounded-none border-l-0"
                  inputMode="numeric"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepRoles({
  managers,
  managerPhone,
  setManagerPhone,
  addManager,
  removeManager,
  t,
}: {
  managers: ManagerEntry[];
  managerPhone: string;
  setManagerPhone: (v: string) => void;
  addManager: () => void;
  removeManager: (id: string) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-chalk">{t("rolesTitle")}</h2>
        <p className="text-sm text-plum">{t("rolesSubtitle")}</p>
      </div>

      <div className="flex gap-2">
        <div className="flex min-w-0 flex-1 overflow-hidden rounded-md">
          <span className="flex items-center border border-r-0 border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-plum">
            +91
          </span>
          <Input
            value={managerPhone}
            onChange={(e) =>
              setManagerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder={t("managerPhonePlaceholder")}
            className="min-w-0 rounded-none border-l-0"
            inputMode="tel"
          />
        </div>
        <Button
          type="button"
          onClick={addManager}
          disabled={managerPhone.length < 10}
          className="shrink-0 bg-teal font-semibold text-ink shadow-glow hover:bg-chalk"
        >
          {t("invite")}
        </Button>
      </div>

      {managers.length > 0 && (
        <div className="space-y-2">
          {managers.map((m) => (
            <div
              key={m.id}
              className="liquid-glass flex items-center justify-between rounded-xl border-0 px-4 py-3"
            >
              <span className="text-sm font-medium text-chalk">+91 {m.phone}</span>
              <button
                type="button"
                onClick={() => removeManager(m.id)}
                className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
