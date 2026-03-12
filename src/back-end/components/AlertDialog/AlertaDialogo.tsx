import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/back-end/components/ui/alert-dialog";
import React from "react";



export default function AlertDialog(param: any, value: any, description: any, action: any) {
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);
    return (
        <>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <param name="" value="" />
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                                Delete
                            </button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}