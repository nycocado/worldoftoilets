'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MapPin, User, Save, Upload, ImagePlus } from 'lucide-react';
import {
  approveSuggestion,
  rejectSuggestion,
  updateToilet,
  publishSuggestionImage,
  setSuggestionPending,
  uploadToiletImage,
  getSuggestionDetails,
} from '@/lib/api/admin';
import { toast } from 'sonner';
import { SuggestionMap } from './SuggestionMap';

interface SuggestionDetailDialogProps {
  suggestion: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete: () => void;
}

export function SuggestionDetailDialog({
  suggestion,
  open,
  onOpenChange,
  onActionComplete,
}: SuggestionDetailDialogProps) {
  const [details, setDetails] = useState<any>(suggestion);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Expanded Edited Data State
  const [editedData, setEditedData] = useState<{
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    access: string; // apiName
    extras: string[]; // Changed to array of strings
    latitude: number;
    longitude: number;
    photoUrl: string;
  }>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    access: '',
    extras: [],
    latitude: 0,
    longitude: 0,
    photoUrl: '',
  });

  const AVAILABLE_EXTRAS = [
    { id: 'wheelchair-accessible', label: 'Acessível a Cadeira de Rodas' },
    { id: 'baby-changing-station', label: 'Fraldário' },
    { id: 'disabled-parking', label: 'Estacionamento para Deficientes' },
    { id: 'accessible-for-visually-impaired', label: 'Acessibilidade Visual' },
  ];

  const [showConfirmAccept, setShowConfirmAccept] = useState(false);
  const [publishImage, setPublishImage] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    if (open && suggestion) {
      setDetails(suggestion);
      initializeEditedData(suggestion);
      fetchDetails(); // Get fresh details to ensure we have toilet data
    }
  }, [open, suggestion]);

  const fetchDetails = async () => {
    try {
      const response = await getSuggestionDetails(suggestion.publicId);
      const freshData = response.data;
      setDetails(freshData);
      if (!editMode) {
        initializeEditedData(freshData);
      }
    } catch (error) {
      console.error('Failed to refresh details');
    }
  };

  const initializeEditedData = (data: any) => {
    const toilet = data.toilet || {};

    // Normalize extras to string array
    let currentExtras: string[] = [];
    if (Array.isArray(toilet.extras)) {
      currentExtras = toilet.extras.map((e: any) =>
        typeof e === 'object' ? e.apiName : e,
      );
    }

    setEditedData({
      name: toilet.name || '',
      address: toilet.address || '',
      city: toilet.city || '',
      state: toilet.state || '',
      country: toilet.country || '',
      access: toilet.access?.apiName || 'public',
      extras: currentExtras || [], // Ensure array

      // These come from suggestion primarily if we are looking at the suggestion
      latitude: data.latitude || toilet.latitude || 0,
      longitude: data.longitude || toilet.longitude || 0,
      photoUrl: data.photoUrl || toilet.photoUrl || '',
    });
  };



  const handleSaveEdits = async () => {
    setProcessing(true);
    try {
      // Clean up data before sending?
      await updateToilet(details.toilet.publicId, editedData);
      toast.success('Dados da casa de banho atualizados.');
      setEditMode(false);
      fetchDetails();
    } catch (error) {
      toast.error('Erro ao salvar alterações.');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadToiletImage(details.toilet.publicId, file);

      if (response.data && response.data.photoUrl) {
        setDetails((prev: any) => ({ ...prev, toilet: response.data })); // Update the toilet object in details
        setEditedData((prev) => ({
          ...prev,
          photoUrl: response.data.photoUrl,
        })); // Update photoUrl in editedData
        toast.success('Upload concluído!');
      } else {
        toast.error('Erro: photoUrl da imagem não recebida na resposta.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  // Actions
  const handleAcceptFlow = () => {
    // Check if the suggestion originally had a photo
    const suggestionHadPhoto = !!suggestion.photoUrl;
    // Check if the toilet currently has a different photo than the suggestion
    const toiletHasDifferentPhoto =
      suggestion.photoUrl !== details.toilet.photoUrl;
    // Check if the admin is currently planning to use the suggested photo (i.e., didn't upload a new one)
    const adminUsingSuggestedPhoto =
      editedData.photoUrl === suggestion.photoUrl;

    if (
      suggestionHadPhoto &&
      toiletHasDifferentPhoto &&
      adminUsingSuggestedPhoto
    ) {
      setShowConfirmAccept(true); // Ask about publishing the original suggested photo
    } else {
      executeAccept(false); // Just accept the suggestion, no photo publish needed
    }
  };

  const executeAccept = async (publish: boolean) => {
    setProcessing(true);
    try {
      if (publish && suggestion.photoUrl) {
        // Use suggestion.photoUrl to confirm if the original suggested photo is being published
        await publishSuggestionImage(suggestion.publicId); // Use suggestion's publicId for publish endpoint
        toast.success('Imagem original da sugestão publicada com sucesso.');
      }
      await approveSuggestion(suggestion.publicId);
      toast.success('Sugestão aceita.');
      setShowConfirmAccept(false);
      onActionComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao aceitar.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      await rejectSuggestion(details.publicId);
      toast.success('Rejeitada.');
      onActionComplete();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro.');
    } finally {
      setProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden flex flex-col p-0 gap-0">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-background z-10 shrink-0">
          <div>
            <DialogTitle>Detalhes e Edição</DialogTitle>
            <DialogDescription>
              Revise os dados sugeridos ou edite completamente a casa de banho.
            </DialogDescription>
          </div>
          <div className="flex gap-2">
            {!editMode && details?.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(true)}
              >
                <User className="mr-2 h-4 w-4" /> Editar Tudo
              </Button>
            )}
            {editMode && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditMode(false);
                    fetchDetails();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdits}
                  disabled={processing || uploading}
                >
                  <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row h-full min-h-0 flex-1 overflow-hidden">
          {/* Left: Map & Location */}
          <div className="md:w-1/2 flex flex-col border-r bg-muted/10 relative p-6 gap-4 max-h-[400px] md:max-h-none">
            <div className="rounded-xl overflow-hidden border shadow-sm w-full h-64 md:h-full relative bg-muted">
              <SuggestionMap
                toiletLat={details.toilet?.latitude || 0}
                toiletLon={details.toilet?.longitude || 0}
                userLat={editedData.latitude || 0}
                userLon={editedData.longitude || 0}
                editMode={editMode}
                onUserMarkerDrag={(lat, lng) => 
                  setEditedData(prev => ({ ...prev, latitude: lat, longitude: lng }))
                }
              />
              
              {editMode && (
                <div className="absolute top-4 left-4 right-4 bg-background/90 backdrop-blur p-3 rounded-lg border shadow-sm text-xs z-10 pointer-events-none">
                  <p className="font-medium text-amber-600 mb-1">
                    Modo de Edição
                  </p>
                  Arraste o marcador vermelho para ajustar a localização
                  sugerida.
                </div>
              )}
            </div>
          </div>

          {/* Right: Full Form */}
          <div className="md:w-1/2 p-6 overflow-y-auto bg-background">
            <div className="space-y-6">
              {/* Image Section */}
              <div className="space-y-3">
                <Label>Imagem da Casa de Banho</Label>
                <div className="rounded-lg overflow-hidden border aspect-square w-full relative group bg-muted shadow-sm">
                  {editedData.photoUrl ? (
                    <img
                      src={editedData.photoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <ImagePlus className="h-10 w-10 opacity-20" />
                    </div>
                  )}

                  {editMode && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Carregar do PC
                      </Button>
                    </div>
                  )}
                </div>
                {editMode && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={editedData.name}
                    onChange={(e) =>
                      setEditedData({ ...editedData, name: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Textarea
                    value={editedData.address}
                    onChange={(e) =>
                      setEditedData({ ...editedData, address: e.target.value })
                    }
                    disabled={!editMode}
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input
                      value={editedData.city}
                      onChange={(e) =>
                        setEditedData({ ...editedData, city: e.target.value })
                      }
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Distrito/Estado</Label>
                    <Input
                      value={editedData.state}
                      onChange={(e) =>
                        setEditedData({ ...editedData, state: e.target.value })
                      }
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>País</Label>
                    <Input
                      value={editedData.country}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          country: e.target.value,
                        })
                      }
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Acesso</Label>
                  <Select
                    value={editedData.access}
                    onValueChange={(v) =>
                      setEditedData({ ...editedData, access: v })
                    }
                    disabled={!editMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                      <SelectItem value="consumers-only">
                        Clientes (Consumidores)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      value={editedData.latitude}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          latitude: parseFloat(e.target.value),
                        })
                      }
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      value={editedData.longitude}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          longitude: parseFloat(e.target.value),
                        })
                      }
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Label>Extras e Comodidades</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {AVAILABLE_EXTRAS.map((extra) => (
                      <div
                        key={extra.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={extra.id}
                          checked={editedData.extras.includes(extra.id)}
                          onCheckedChange={(checked) => {
                            setEditedData((prev) => {
                              const newExtras = checked
                                ? [...prev.extras, extra.id]
                                : prev.extras.filter((e) => e !== extra.id);
                              return { ...prev, extras: newExtras };
                            });
                          }}
                          disabled={!editMode}
                        />
                        <label
                          htmlFor={extra.id}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {extra.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 border-t bg-background shrink-0">
          {details?.status === 'pending' ? (
            <div className="flex w-full justify-between">
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={processing}
              >
                Rejeitar Sugestão
              </Button>
              <Button
                onClick={handleAcceptFlow}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Aceitar Sugestão
              </Button>
            </div>
          ) : (
            <div className="w-full flex justify-end">
              <Badge
                variant={
                  details?.status === 'accepted' ? 'default' : 'secondary'
                }
              >
                {details?.status === 'accepted' ? 'Aceita' : 'Rejeitada'}
              </Badge>
            </div>
          )}
        </DialogFooter>

        {/* Confirm Accept Dialog */}
        {showConfirmAccept && (
          <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
              <DialogTitle>Publicar Imagem?</DialogTitle>
              <DialogDescription>
                Esta sugestão inclui uma nova foto. Deseja definir esta foto
                como a imagem principal da casa de banho?
              </DialogDescription>

              <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/30">
                <Checkbox
                  id="publish"
                  checked={publishImage}
                  onCheckedChange={(c) => setPublishImage(!!c)}
                />
                <label
                  htmlFor="publish"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sim, publicar como imagem principal
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowConfirmAccept(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={() => executeAccept(publishImage)}>
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
