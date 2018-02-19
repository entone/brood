defmodule Brood.Resource.Account do
  require Logger
  alias Brood.Resource.Account
  alias Comeonin.Pbkdf2

  @account_collection Application.get_env(:brood, :account_collection)
  @kit_collection Application.get_env(:brood, :kit_collection)

  defmodule Kit do
    @derive [Poison.Encoder]
    defstruct [:id, :name, :settings]
  end

  defstruct _id: nil, email: nil, password: nil, kits: [], zipcode: nil, climate_zone: nil

  def register(%Account{} = account, password_conf) do
    case account.password == password_conf do
      true ->
        account = %Account{account |
          password: account.password |> Pbkdf2.hashpwsalt,
          _id: Mongo.object_id()
        }
        account = Account.update_kits(account)
        :mongo_brood |> Mongo.insert_one(@account_collection, Map.from_struct(account), pool: DBConnection.Poolboy)
      _ -> :password_mismatch
    end
  end

  def update(%Account{} = account) do
    account = Account.update_kits(account)
    :mongo_brood |> Mongo.find_one_and_replace(@account_collection, %{_id: account._id}, Map.from_struct(account), pool: DBConnection.Poolboy)
    account
  end

  def update_kits(%Account{} = account) do
    kits =
      Enum.map(account.kits, fn(kit) ->
        Logger.info "Updating: #{inspect kit}"
        res = :mongo_brood |> Mongo.update_one(@kit_collection,%{id: kit.id}, %{"$set": %{"id": kit.id, "name": kit.name}}, pool: DBConnection.Poolboy, upsert: true)
        kit.id
      end)
    %Account{account | kits: Enum.uniq(kits)}
  end

  def authenticate(%Account{email: email, password: password} = auth) do
    with %Account{email: email} = account <- auth |> find_user(),
      true <- auth |> validate_pw(account),
    do: account
  end

  def find_user(%Account{email: email} = user) do
    with doc <- :mongo_brood |> Mongo.find_one(@account_collection, %{email: email}, pool: DBConnection.Poolboy),
      %Account{email: username} = account <- parse_params(doc),
    do: account
  end

  def from_id(%BSON.ObjectId{} = id) do
    :mongo_brood |> Mongo.find_one(@account_collection, %{_id: id}, pool: DBConnection.Poolboy) |> parse_params
  end
  def from_id(id), do: BSON.ObjectId.decode!(id) |> from_id

  def validate_pw(%Account{password: password} = auth, %Account{password: hash} = account) do
    case Pbkdf2.checkpw(password, hash) do
      true -> true
      false -> :invalid_password
    end
  end

  def cleanse(%Account{} = account) do
    %Account{account | _id: BSON.ObjectId.encode!(account._id), password: nil}
  end

  def delete(%Account{} = account) do
    :mongo_brood |> Mongo.delete_one(@account_collection, %{_id: account._id}, pool: DBConnection.Poolboy)
  end

  def delete(:no_account), do: :ok

  def parse_params(nil), do: :no_account
  def parse_params(params) do
    kits = get_kits(params)
    %Account{}
    |> Map.keys()
    |> Enum.reduce(%Account{kits: kits}, fn(k, acc) ->
      case Map.get(params, Atom.to_string(k)) do
        nil -> acc
        v when k != :kits -> Map.put(acc, k, v)
        v -> acc
      end
    end)
  end

  def get_kits(%Account{} = account) do
    docs = :mongo_brood |> Mongo.find(@kit_collection, %{id: %{"$in": account.kits}}, pool: DBConnection.Poolboy)
    %Account{account | kits: Enum.map(docs, fn(doc) ->
      %Kit{id: Map.get(doc, "id"), name: Map.get(doc, "name"), settings: Map.get(doc, "settings")}
    end)}
  end

  def get_kits(params) do
    case Map.get(params, "kit_id") do
      nil ->
        case Map.get(params, "kits") do
          nil -> []
          vals ->
            docs = :mongo_brood |> Mongo.find(@kit_collection, %{id: %{"$in": vals}}, pool: DBConnection.Poolboy)
            Enum.map(docs, fn(doc) ->
              %Kit{id: Map.get(doc, "id"), name: Map.get(doc, "name"), settings: Map.get(doc, "settings")}
            end)
        end
      other -> [%Kit{id: Map.get(params, "kit_id"), name: Map.get(params, "location_name"), settings: %{}}]
    end
  end

  def index() do
    account_indexes()
    kit_indexes()
  end

  def account_indexes() do
    indexes = [
      %{
        key: %{email: 1},
        name: "email",
        unique: true
      },
      %{
        key: %{zipcode: "hashed"},
        name: "zipcode",
        unique: false
      },
      %{
        key: %{climate_zone: "hashed"},
        name: "climate_zone",
        unique: false
      }
    ]
    Logger.debug "Creating #{@account_collection} Indexes: #{inspect indexes}"
    :mongo_brood |> Mongo.command!([createIndexes: @account_collection, indexes: indexes], pool: DBConnection.Poolboy)
  end

  def kit_indexes() do
    indexes = [
      %{
        key: %{id: 1},
        name: "id",
        unique: true
      },
      %{
        key: %{"name" => "hashed"},
        name: "name",
        unique: false
      }
    ]
    Logger.debug "Creating #{@kit_collection} Indexes: #{inspect indexes}"
    :mongo_brood |> Mongo.command!([createIndexes: @kit_collection, indexes: indexes], pool: DBConnection.Poolboy)
  end
end
