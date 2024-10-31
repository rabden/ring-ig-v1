import React from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";
import { styleConfigs } from '@/utils/styleConfigs';
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const StyleSelector = ({ style, setStyle }) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSelect = (value) => {
    setStyle(value === style ? null : value);
    setOpen(false);
  };

  const stylesList = React.useMemo(() => {
    return Object.entries(styleConfigs).map(([key, config]) => ({
      value: key,
      label: config.name
    }));
  }, []);

  const currentStyle = style ? styleConfigs[style]?.name : "Select style";

  const renderStyleItems = (items) => {
    return items.map(({ value, label }) => (
      <CommandItem
        key={value}
        value={value}
        onSelect={() => handleSelect(value)}
        className="flex items-center justify-between"
      >
        {label}
        {value === style && <Check className="h-4 w-4" />}
      </CommandItem>
    ));
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {currentStyle}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search styles..." />
            <CommandEmpty>No style found.</CommandEmpty>
            <CommandGroup>
              {renderStyleItems(stylesList)}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen(true)}
      >
        {currentStyle}
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Choose Style</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <Command className="rounded-lg border shadow-md">
              <CommandInput placeholder="Search styles..." />
              <CommandEmpty>No style found.</CommandEmpty>
              <ScrollArea className="h-[300px]">
                <CommandGroup>
                  {renderStyleItems(stylesList)}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default StyleSelector;