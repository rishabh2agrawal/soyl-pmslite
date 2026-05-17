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

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -300 : 300,
    opacity: 0,
  }),
};

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
      <div className="sticky top-0 z-10 bg-background/90 px-4 pb-2 pt-4 backdrop-blur-sm safe-area-pt">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            {step + 1} / {STEPS}
          </span>
        </div>
        <Progress value={((step + 1) / STEPS) * 100} className="h-1.5" />
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-hidden px-4 py-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="space-y-6"
          >
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="sticky bottom-0 flex items-center gap-3 border-t border-border bg-white/80 px-4 py-3 backdrop-blur-xl safe-area-pb">
        {step > 0 && (
          <Button variant="outline" onClick={goBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
        )}
        <div className="flex-1" />
        {step < STEPS - 1 ? (
          <Button onClick={goNext} disabled={!canProceed()} className="gap-2">
            {t("next")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleComplete} className="gap-2">
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
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Globe className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{t("welcomeTitle")}</h1>
      <p className="mt-2 text-muted-foreground">{t("welcomeSubtitle")}</p>

      <div className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
              selectedLang === lang.code
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40",
            )}
          >
            <span className="text-2xl font-bold text-foreground">
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
      <h2 className="text-xl font-bold">{t("propertyTitle")}</h2>

      <div className="space-y-2">
        <Label htmlFor="prop-name">{t("propertyName")}</Label>
        <Input
          id="prop-name"
          value={property.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder={t("propertyNamePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prop-address">{t("address")}</Label>
        <Textarea
          id="prop-address"
          value={property.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder={t("addressPlaceholder")}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prop-phone">{t("phone")}</Label>
        <div className="flex">
          <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
            +91
          </span>
          <Input
            id="prop-phone"
            value={property.phone}
            onChange={(e) =>
              update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="9876543210"
            className="rounded-l-none"
            inputMode="tel"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("propertyType")}</Label>
        <Select
          value={property.type}
          onValueChange={(v) => update("type", v)}
        >
          <SelectTrigger>
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
        <Label htmlFor="prop-gstin">{t("gstin")} ({t("optional")})</Label>
        <Input
          id="prop-gstin"
          value={property.gstin}
          onChange={(e) => update("gstin", e.target.value.toUpperCase())}
          placeholder="22AAAAA0000A1Z5"
          maxLength={15}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("logo")} ({t("optional")})</Label>
        <Input type="file" accept="image/*" />
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
        <h2 className="text-xl font-bold">{t("roomsTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("roomsSubtitle")}</p>
      </div>

      <div className="space-y-4">
        {roomTypes.map((room, idx) => (
          <div
            key={room.id}
            className="space-y-3 rounded-xl border border-border bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {t("roomType")} {idx + 1}
              </span>
              {roomTypes.length > 1 && (
                <button
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
                <Label className="text-xs">{t("count")}</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() =>
                      updateRoomType(
                        room.id,
                        "count",
                        Math.max(1, room.count - 1),
                      )
                    }
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-semibold">
                    {room.count}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() =>
                      updateRoomType(room.id, "count", room.count + 1)
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">{t("baseRate")}</Label>
                <div className="flex">
                  <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-2 text-sm text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={room.baseRate}
                    onChange={(e) =>
                      updateRoomType(
                        room.id,
                        "baseRate",
                        Number(e.target.value),
                      )
                    }
                    className="rounded-l-none"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addRoomType} className="w-full gap-2">
        <Plus className="h-4 w-4" />
        {t("addRoomType")}
      </Button>

      <div className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3">
        <span className="text-sm">{t("autoNumber")}</span>
        <button
          onClick={() => setAutoNumber(!autoNumber)}
          className={cn(
            "relative h-6 w-11 rounded-full transition-colors",
            autoNumber ? "bg-primary" : "bg-border",
          )}
        >
          <span
            className={cn(
              "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm",
              autoNumber && "translate-x-5",
            )}
          />
        </button>
      </div>

      {totalRooms > 0 && (
        <p className="text-sm text-muted-foreground">
          {t("totalRooms")}: <strong>{totalRooms}</strong>
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
        <h2 className="text-xl font-bold">{t("ratesTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("ratesSubtitle")}</p>
      </div>

      {namedTypes.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noRoomTypes")}</p>
      ) : (
        <div className="space-y-3">
          {namedTypes.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3"
            >
              <div>
                <p className="font-medium">{room.name}</p>
                <p className="text-xs text-muted-foreground">
                  {room.count} {room.count === 1 ? "room" : "rooms"}
                </p>
              </div>
              <div className="flex w-32">
                <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-2 text-sm text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  value={room.baseRate}
                  onChange={(e) =>
                    updateRoomType(room.id, "baseRate", Number(e.target.value))
                  }
                  className="rounded-l-none"
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
        <h2 className="text-xl font-bold">{t("rolesTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("rolesSubtitle")}</p>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-1">
          <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
            +91
          </span>
          <Input
            value={managerPhone}
            onChange={(e) =>
              setManagerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder={t("managerPhonePlaceholder")}
            className="rounded-l-none"
            inputMode="tel"
          />
        </div>
        <Button
          onClick={addManager}
          disabled={managerPhone.length < 10}
          size="default"
        >
          {t("invite")}
        </Button>
      </div>

      {managers.length > 0 && (
        <div className="space-y-2">
          {managers.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3"
            >
              <span className="text-sm font-medium">+91 {m.phone}</span>
              <button
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
