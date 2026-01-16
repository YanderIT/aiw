"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import SignForm from "./form";
import { useAppContext } from "@/contexts/app";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function SignModal() {
  const t = useTranslations();
  const { showSignModal, setShowSignModal } = useAppContext();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const DialogHeaderContent = () => (
    <DialogHeader className="items-center text-center">
      <Image src="/logo.png" alt="logo" width={80} height={20} className="mb-4" />
      <DialogTitle>{t("sign_modal.sign_in")}</DialogTitle>
      <DialogDescription>
        {t("sign_modal.first_login_notice")}
      </DialogDescription>
    </DialogHeader>
  )

  if (isDesktop) {
    return (
      <Dialog open={showSignModal} onOpenChange={setShowSignModal}>
        <DialogContent className="sm:max-w-lg lg:max-w-xl bg-gradient-to-br from-background via-primary/5 to-background border-primary/20 backdrop-blur-sm shadow-2xl shadow-primary/10">
          <DialogHeaderContent />
          <div className="px-4">
            <SignForm />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={showSignModal} onOpenChange={setShowSignModal}>
      <DrawerContent className="bg-gradient-to-t from-background via-primary/5 to-background border-primary/20 backdrop-blur-sm shadow-2xl shadow-primary/10">
        <div className="p-6">
          <DialogHeaderContent />
          <SignForm />
        </div>
        <DrawerFooter className="pt-4">
          <DrawerClose asChild>
            <Button variant="outline">{t("sign_modal.cancel_title")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
