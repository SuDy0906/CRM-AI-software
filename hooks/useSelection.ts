// hooks/useSelection.ts
import { useState } from 'react';
import { ObjectId } from 'mongodb';

interface SelectionItem {
    _id: ObjectId;
}

export const useSelection = <T extends SelectionItem>(items: T[]) => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggle = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selected.length === items.length) {
            setSelected([]);
        } else {
            setSelected(items.map((item) => item._id.toString()));
        }
    };

    return { selected, toggle, toggleAll };
};
