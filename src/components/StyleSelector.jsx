import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Drawer } from "vaul";
import { styleConfigs } from '@/utils/styleConfigs';
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const StyleSelector = ({ style, setStyle }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const styles = useMemo(() => {
    if (!styleConfigs) return [];
    return Object.entries(styleConfigs).map(([key, config]) => ({
      value: key,
      label: config?.name || key,
    }));
  }, []);

  const filteredStyles = useMemo(() => {
    if (!search) return styles;
    if (!styles) return [];
    return styles.filter((s) => 
      s.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [styles, search]);

  const currentStyle = useMemo(() => {
    if (!style || !styleConfigs) return 'Select style';
    return styleConfigs[style]?.name || 'Select style';
  }, [style]);

  const handleSelect = (value) => {
    setStyle(value === style ? null : value);
    setOpen(false);
  };

  const StyleList = () => (
    <Command>
      <CommandInput 
        placeholder="Search styles..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandEmpty>No style found.</CommandEmpty>
      <CommandGroup>
        <ScrollArea className="h-[300px]">
          {filteredStyles.map((s) => (
            <CommandItem
              key={s.value}
              value={s.value}
              onSelect={() => handleSelect(s.value)}
              className="flex items-center justify-between"
            >
              <span>{s.label}</span>
              {style === s.value && <Check className="h-4 w-4" />}
            </CommandItem>
          ))}
        </ScrollArea>
      </CommandGroup>
    </Command>
  );

  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {currentStyle}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] h-[50vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
            <div className="p-4 bg-muted/40 rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mb-8" />
              <StyleList />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {currentStyle}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <StyleList />
      </PopoverContent>
    </Popover>
  );
};

export default StyleSelector;