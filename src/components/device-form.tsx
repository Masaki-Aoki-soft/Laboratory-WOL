/* デバイスの登録フォームコンポーネント */

'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeviceFormValues, deviceSchema } from '@/lib/validation';
import { type Device } from '@/types/DeviceType';

interface DeviceFormProps {
    device?: Device | null;
    onSave: (data: DeviceFormValues) => Promise<void> | void;
    onCancel: () => void;
}

export const DeviceForm = ({ device, onSave, onCancel }: DeviceFormProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DeviceFormValues>({
        resolver: zodResolver(deviceSchema),
        defaultValues: {
            name: '',
            macAddress: '',
            description: '',
        },
    });

    useEffect(() => {
        if (device) {
            reset({
                name: device.name,
                macAddress: device.macAddress,
                description: device.description || '',
            });
        }
    }, [device, reset]);

    const onSubmit: SubmitHandler<DeviceFormValues> = async (data) => {
        console.log('onSubmitが呼び出されました。フォームデータ:', data);
        setIsLoading(true);
        try {
            await onSave(data);
            console.log('onSave関数が正常に完了しました。');
        } catch (e) {
            console.error('onSaveの実行中にエラーが発生しました:', e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{device ? 'デバイス編集' : 'デバイス追加'}</DialogTitle>
                    <DialogDescription>
                        Wake on LANで起動するデバイスの情報を入力してください
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* ...フォーム項目は変更なし... */}
                    <div className="space-y-2">
                        <Label htmlFor="name">デバイス名 *</Label>
                        <Input
                            id="name"
                            disabled={isLoading}
                            placeholder="例: メインPC"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="macAddress">MACアドレス *</Label>
                        <Input
                            id="macAddress"
                            disabled={isLoading}
                            placeholder="例: 00:11:22:33:44:55"
                            {...register('macAddress')}
                        />
                        {errors.macAddress && (
                            <p className="text-sm text-red-500">{errors.macAddress.message}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            コロン(:)またはハイフン(-)区切りで入力してください
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">説明（任意）</Label>
                        <Textarea
                            id="description"
                            disabled={isLoading}
                            placeholder="例: VIT1○○"
                            rows={3}
                            {...register('description')}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            className="cursor-pointer"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="cursor-pointer bg-[#00BFFF]"
                        >
                            {isLoading ? '処理中...' : device ? '更新' : '追加'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
