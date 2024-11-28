"use client";
import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { getAllTags } from "@/helpers/communicator";

export type Tag = Record<"value", string>;

const getTags = async () : Promise<any> => {
    try {
        const res = await getAllTags();
        if (res) {
            const data = res.response;
            return data.map((tag : any) => ({ value: tag.title }))
        }
        return [];        
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      return [];
    }
};

export function FancyMultiSelect({
    selected,
    setSelected,
  }: {
    selected: Tag[];
    setSelected: React.Dispatch<React.SetStateAction<Tag[]>>;
  }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // A state to track all available tags, including dynamically added ones.
  const [allTags, setAllTags] = React.useState<Tag[]>([]);

    React.useEffect(() => {
        const fetchTags = async () => {
            const TAGS = await getTags(); 
            setAllTags(TAGS); 
        };
        fetchTags();
    }, []);

  const handleUnselect = React.useCallback((tag: Tag) => {
    setSelected((prev) => prev.filter((s) => s.value !== tag.value));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }

        if (e.key === "Enter") {
            if(input.value !== ""){
                const newTag = { value : input.value };

                // If tag already exists in the available tags
                if (!allTags.some((tag) => tag.value === newTag.value)) {
                    setAllTags((prev) => [...prev, newTag]); 
                }

                if (!selected.some((tag) => tag.value === newTag.value)) {
                    setSelected((prev) => [...prev, newTag]);
                }

                setInputValue("");
                setOpen(false); 
            }
        }


        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = allTags.filter(
    (tag) => !selected.includes(tag)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((tag) => {
            return (
              <Badge key={tag.value} variant="secondary">
                {tag.value}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(tag);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(tag)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}

          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select tags..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((tag) => {
                  return (
                    <CommandItem
                      key={tag.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, tag]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {tag.value}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}